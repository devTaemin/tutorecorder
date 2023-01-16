package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 유저 회원정보수정API ([PUT] /api/v1/users/userId) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("UserPatchGetRequest")
public class UserPatchGetReq {

    @ApiModelProperty(name="유저 Position", example="your_password")
    String position;

    @ApiModelProperty(name="유저 Department", example="your_password")
    String department;

    @ApiModelProperty(name="유저 Name", example="your_password")
    String name;
}
