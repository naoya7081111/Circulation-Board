/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Flex, Image, Input, Link, Spacer, Stack, Text } from "@chakra-ui/react";
import { ChangeEvent, memo, MouseEvent, useCallback, useState, VFC } from "react";
import { useHistory } from "react-router-dom";
import { useCommunityLists } from "../../../hooks/context/useCommunityLists";
import { useLoginUser } from "../../../hooks/context/useLoginUser";
import { useEntryJoin } from "../../../hooks/entry/useEntryJoin";
import { useEntrySearch } from "../../../hooks/entry/useEntrySearch";
import { LoginButton } from "../../atoms/button/LoginButton";
import { ListBelongCard } from "../../molecules/listCard/ListBelongCard";

export const EntryContent: VFC = memo(() => {

    const { entrySearch, resultCommunity, setResultCommunity, isPassword, setIsPassword, searchLoading, setSearchLoading } = useEntrySearch();
    const { entry, joinLoading } = useEntryJoin();
    const history = useHistory();
    const { loginUser } = useLoginUser();
    const { communityLists } = useCommunityLists();

    const [id, setId] = useState<number>(0);
    const [password, setPassword] = useState('');
    const [isResult, setIsResult] = useState(false);
    const [isAlready, setIsAlready] = useState(true);

    const onChangeName = (e: ChangeEvent<HTMLInputElement>) => setId(Number(e.target.value));

    const onClickSearch = useCallback(() => {
        entrySearch({ id });
        setIsResult(true);
        setIsAlready(false);
    },[id]);

    const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

    const onClickEnter = useCallback(() => {
        entry({ id, password, isAlready });
        setIsResult(false);
    }, [id, password, isAlready]);

    const onClickSelectEnter = (e: MouseEvent<HTMLButtonElement>) => {
        // targetまでをHTMLButtonElementとしてTSに認識させる必要あり
        const getCommunityId = (e.target as HTMLButtonElement).value;
        entry({ id: Number(getCommunityId),  password, isAlready});
    }

    const onClickEstablish = () => {
        history.push('/establish');
    }

    const onClickBack = () => {
        setResultCommunity(null);
        setIsPassword(false);
        setId(0);
        setIsResult(false);
        setIsAlready(true);
        setSearchLoading(false);
    }

    return (
        <Stack spacing={6} >
            {!isResult ? (
                <>
                    <Input  placeholder="コミュニティIDを入力してください" onChange={onChangeName} type="number" />
                    <LoginButton onClick={onClickSearch} disabled={id === 0} loading={searchLoading} >
                        コミュニティを検索する
                    </LoginButton>
                    <Link onClick={onClickEstablish} textAlign="center" fontSize='md' color="teal.400" >コミュニティを作成</Link>
                    <Box h="256px" overflow="auto" alignItems="center">
                        {loginUser && communityLists.map((c) => (
                            <ListBelongCard  key={c.communityId} width={{base: "280px", sm:"360px", md: "480px"}} value={c.communityId} buttonName='参加' image={c.communityImageName ?? null} onClickButton={onClickSelectEnter} >
                                {c.communityName}
                            </ListBelongCard>
                        ))}
                    </Box>
                </>
            ) : (
                <>
                    {resultCommunity !== null ? (
                        <>
                            <Flex h="72px" p={2} alignItems="center" borderRadius={10}  > 
                                <Image borderRadius="lg" boxSize="48px" src={resultCommunity.communityImageName === null ? `${process.env.PUBLIC_URL}/img/freemeisoncommunity.png` : `https://object-storage.tyo2.conoha.io/v1/nc_819897bd08504d38bcce5fc9b4d08a6f/test/${resultCommunity.communityImageName}`} />
                                <Text fontSize="md" fontWeight="bold" pl={4} >
                                    {resultCommunity?.communityName}
                                </Text>
                                <Spacer />
                            </Flex>
                            {isPassword && (
                                <>
                                    <Input  placeholder="パスワードを入力してください" type="password" onChange={onChangePassword}/>                                
                                </>
                            )}
                            <LoginButton onClick={onClickEnter} disabled={isPassword && password === '' } loading={joinLoading} >
                                入会する
                            </LoginButton>                                
                        </>
                    ) : (
                        <>
                            <Text mb={10} fontSize="md" fontWeight="bold" textAlign='center'>該当するコミュニティは見つかりませんでした</Text>
                        </>
                    )}
                    <Link onClick={onClickBack} textAlign="center" fontSize='md' color="pink.300" >戻る</Link>
                </>
            )}
        </Stack>
    )
});