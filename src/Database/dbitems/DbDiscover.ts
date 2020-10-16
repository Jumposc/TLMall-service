export interface DbDiscover {
    _id: string,
    content: string,
    imageUrl: string,
    creator: {
        uid: string,
        nickName: string,
        avatar: string
    },
    likedUids: string[]
}