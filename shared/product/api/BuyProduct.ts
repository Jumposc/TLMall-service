export interface RequestBuyProduct{
    products:[
        {
            id:number,
            amount:number
        }
    ]
    token:string
}

export interface ResponseBuyProduct{
}