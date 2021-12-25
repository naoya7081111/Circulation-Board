/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Divider, Flex, FormControl, FormLabel, Heading, Input, Stack, Switch } from "@chakra-ui/react";
import { ChangeEvent, memo, useCallback, useState, VFC } from "react";
import { useEstablish } from "../../hooks/useEstablish";
import { useMessage } from "../../hooks/useMessage";
import { LoginButton } from "../atoms/button/LoginButton";

export const Establish: VFC = memo(() => {

    const { showMessage } = useMessage();
    const { establish, loading } = useEstablish();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [addPassword, setAddPassword] = useState(false);

    const onChangeName = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);
    const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
    const onChangePassword2 = (e: ChangeEvent<HTMLInputElement>) => setPassword2(e.target.value);

    const onChangeAddPassword = () => setAddPassword(!addPassword);

    const onClickSignUp = useCallback(() => {
        if(addPassword){
            password === password2 ? establish({ name, password }) : showMessage({ title: "パスワードが違います", status: "error" });
        } else {
            establish({ name, password });
        }
    }, [name, password,password2, addPassword]);

    const onClickEnter = (e: any) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            if(name !== "" && (!addPassword || (password !== '' && password2 !== ''))){
                onClickSignUp();
            }
        }
    }

    return (
        <Flex align="center" justify="center"  height="100vh">
            <Box bg="white" w={{base: "xs", md: "sm"}} p={4} borderRadius="lg" boxShadow="md">
                <Heading as="h1"  size="lg" textAlign="center">
                    コミュニティ作成
                </Heading>
                <Divider my={4}/>
                <Stack spacing={{base: 6, sm: 10}} mx={4} >
                    <Input  placeholder="コミュニティ名を入力してください" fontSize={{base: 12, md: 14}} onChange={onChangeName} onKeyPress={(e) => onClickEnter(e)}/>
                    {addPassword && (
                        <>
                            <Input  placeholder="パスワードを入力してください" type="password" fontSize={{base: 12, md: 14}} onChange={onChangePassword} onKeyPress={(e) => onClickEnter(e)}/>
                            <Input  placeholder="もう一度パスワードを入力してください" type="password" fontSize={{base: 12, md: 14}} onChange={onChangePassword2} onKeyPress={(e) => onClickEnter(e)}/>
                        </>
                    )}
                    <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="email-alerts" mb="0" color='teal.400'>
                        パスワードを追加しますか?
                    </FormLabel>
                    <Switch  onChange={onChangeAddPassword} id="email-alerts" />
                    </FormControl>
                    <LoginButton onClick={onClickSignUp} disabled={name === "" || (addPassword && (password === '' || password2 === ''))} loading={loading} >
                        作成する
                    </LoginButton>
                </Stack>
            </Box>
        </Flex>
    )
});