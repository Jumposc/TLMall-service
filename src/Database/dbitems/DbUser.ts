export interface DbUser{
    _id: string,
    username: string,
    password: string,
    nickName: string,
    avatar: string,
    followedUids: string[]
}