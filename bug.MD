1.无法添加组局
接口地址:/v1/game/added
请求参数:{
"store_code": "1001",
"gb_code": "213",
"gb_price": 1,
"game_people": 2,
"dm_user": "1",
"game_player": []
}
返回报错信息:
{
"code": 5001,
"error": 0,
"message": "Wrong parameters for Exception([string $message [, long $code [, Throwable $previous = NULL]]])"
}
