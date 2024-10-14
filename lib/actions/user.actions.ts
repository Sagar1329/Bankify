'use server'

import { ID } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { cookies } from "next/headers"
import { encryptId, parseStringify } from "../utils"
import { plaidClient } from "../plaid"
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid"
import { revalidatePath } from "next/cache"
import { addFundingSource } from "./dwolla.actions"

const{
    APPWRITE_DATABASE_ID:DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID:USER_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID:BANK_COLLECTION_ID,
}=process.env

export const signIn = async ({ email, password }: signInProps) => {
    try {
        const { account } = await createAdminClient();
        const response = await account.createEmailPasswordSession(email, password);
        return parseStringify(response);

    } catch (error) {

        console.error("Error ", error)
    }
}

export const signUp = async (userData: SignUpParams) => {
    const { email, password, firstName, lastName } = userData
    try {
        const { account } = await createAdminClient();

        const newUserAccount = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`,);
        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(newUserAccount)



    }

    catch (error) {

        console.error("Error ", error)

    }
}


// ... your initilization functions

export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        const user = await account.get();
        return parseStringify(user)
    } catch (error) {
        return null;
    }
}

export async function logoutAccount() {
    try {
        const { account } = await createSessionClient();

        cookies().delete("appwrite-session")

        await account.deleteSession("current");
    } catch (error) {
        console.error("Error ", error)
        return null
    }
}

export const createLinkToken = async (user: any) => {
    try {

        const tokenParams = {
            user: {
                client_user_id: user.$id
            },
            client_name: user.name,
            products: ['auth'] as Products[],
            language: 'en',
            country_codes: ['US', 'IND'] as CountryCode[],
        }
        const response = await plaidClient.linkTokenCreate(tokenParams)
        return parseStringify({ linkToken: response.data.link_token })

    } catch (error) {
        console.error("Error ", error)
        return null
    }
}


export const createBankAccount = async ({
    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    sharableId
}:createBankAccountProps) => {

    try {
        const {database}=await createAdminClient();
        const bankAccount = await database.createDocument(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            ID.unique(),
            {
                userId,
                bankId,
                accountId,
                accessToken,
                fundingSourceUrl,
                sharableId
            }
        )
        return parseStringify(bankAccount);
    } catch (error) {
    }
}

export const exchangePublicToken = async (
    { publicToken
        , user
    }: exchangePublicTokenProps) => {


    try {
        const response = await
            plaidClient.itemPublicTokenExchange({ public_token: publicToken })

        const accessToken = response.data.access_token
        const itemId = response.data.item_id

        //Get account information from Plaid using this access token
        const accountsResponse = await plaidClient
            .accountsGet({ access_token: accessToken })

        const accountData = accountsResponse.data.accounts[0]

        //Create a processor token for Dwolla using this access token and account Id
        const request: ProcessorTokenCreateRequest = {
            account_id: accountData.account_id,
            access_token: accessToken,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum
        }

        const processorTokenResponse = await
            plaidClient.processorTokenCreate(request)

        const processorToken = processorTokenResponse.data.processor_token;

        //Create a funding source for Dwolla using this processor token
        const fundingSourceUrl = await addFundingSource({
            processorToken,
            dwollaCustomerId: user.dwollaCustomerId,
            bankName: accountData.name
        })

        //If the funding source URL is not created throw an error
        if (!fundingSourceUrl) throw Error;

        await createBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accountData.account_id,
            accessToken,
            fundingSourceUrl,
            sharableId: encryptId(accountData.account_id)
        })

        revalidatePath('/')

        return parseStringify({ publicTokenExchange: 'complete' })
    } catch (error) {
        console.error("Error ", error)
        return null
    }
}