import $axios from "axios";

/**
 * 로그인 요청을 수행하는 api 호출 함수
 *
 * @param { object } payload 로그인 정보 - { id: stirng, password: string }
 * @returns Promise
 */
const requestLogin = payload => $axios.post("/auth/login", payload);

const requestSignin = payload => $axios.post("/users", payload);

const requestConfirm = token => $axios.get("/users/me", {headers : {Authorization : token}})

const requestConfirmId = userid => $axios.get(`/users/${userid}`)

export { requestLogin, requestSignin, requestConfirm, requestConfirmId};
