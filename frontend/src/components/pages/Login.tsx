/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, memo, useCallback, useState, VFC } from "react"
import { Box, Flex, Heading, Input, Divider, Stack, Link } from "@chakra-ui/react";

import { LoginButton } from "../atoms/button/LoginButton";
import { useAuth } from "../../hooks/auth/useAuth";
import { useHistory } from "react-router-dom";

export const Login: VFC = memo(() => {
    const [email, setEmail]  = useState('');
    const [password, setPassword]  = useState('');

    const onChangeEmail = (event: ChangeEvent<HTMLInputElement>)=> setEmail(event.target.value);
    const onChangeUserPassword = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

    const history = useHistory();
    const { login, loading } = useAuth();

    const onClickLogin = useCallback(()=> {
        login({ email, password });
    }, [email, password])

    const onClickNew = useCallback(() => {
        history.push('/signup');
    }, []);

    const onClickEnter = (e: any) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            if(email !== "" && password !== ""){
                onClickLogin();
            }
        }
    }

    return (
        <Flex align="center" justify="center"  height="100vh">
            <Box bg="white" w={{base: "xs", md: "sm"}} p={4} borderRadius="md" boxShadow="md">
                <Heading as="h1"  size="lg" textAlign="center">
                    SEAZECH
                </Heading>
                <Divider my={4}/>
                <Stack spacing={6} mx={4} >
                    <Input  placeholder="メールアドレス" onChange={onChangeEmail} onKeyPress={(e) => onClickEnter(e)} />
                    <Input  placeholder="パスワード" type="password" onChange={onChangeUserPassword} onKeyPress={(e) => onClickEnter(e)}/>
                    <LoginButton onClick={onClickLogin} disabled={email === "" || password === ""} loading={loading} >
                        ログイン
                    </LoginButton>
                    <Link onClick={onClickNew} textAlign="center" fontSize='md' color="teal.400" >アカウントを作成</Link>
                </Stack>
            </Box>
        </Flex>
    )
});