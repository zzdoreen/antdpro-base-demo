import { post } from "."

export const getTuringRequestService = (text: string) => {
    if (!text) return

    return post<{ result: { values: { text: string } }[] }>('openapi/api/v2', {
        reqType: 0,
        perception: {
            inputText: { text },
        },
        userInfo: {
            apiKey: 'a0a641c4e0b64735a0e60277b361bf52',
            userId: '528189',
        }
    })
}
