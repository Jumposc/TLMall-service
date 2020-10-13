
export interface DbProductComment{
    _id: string
    productId:string,
    avatarUrl: string;
    nickName: string;
    starNumber: number;
    text: string;
    tags: string[];
    imgs: string[];
    createTime:number
}