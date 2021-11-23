/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useCallback, useEffect, useState, VFC } from "react"
import { Flex, Spacer, Text, useDisclosure, AspectRatio, Image } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Iframe from 'react-iframe';
import { useNewsLists } from "../../hooks/context/useNewsLists";
import { useNeverMembersGet } from "../../hooks/members/useNeverMembersGet";
import { useComplete } from "../../hooks/useComplete";
import { useDate } from "../../hooks/useDate";
import { useDefaultPage } from "../../hooks/useDefaultPage";
import { useHostGet } from "../../hooks/useHostGet";
import { News } from "../../type/News";
import { LoginButton } from "../atoms/button/LoginButton";
import { ListMembersCard } from "../molecules/listCard/ListMembersCard";
import { ViewMainContainer } from "../organisms/layout/news/ViewMainContainer";
import { NeverModal } from "../organisms/modal/NeverModal";
import { useNewsFileNameGet } from "../../hooks/news/useNewsFileNameGet";

export const View: VFC = memo(() => {

    const { newsLists } = useNewsLists();
    const { dateKanji } = useDate();
    const { completeUp } = useComplete();
    const { neverMembersGet, neverMembers } = useNeverMembersGet();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { hostCheck } = useHostGet();
    const { defaultPage } = useDefaultPage();
    const { newsFileNameGet, newsFileNames } = useNewsFileNameGet();

    const params: {newsId: string} = useParams();
    const selectNewsId = Number(params.newsId);

    const [selectNews, setSelectNews] = useState<News | null>(null);

    const findAndSet = () => {
        const findNews: News | undefined = newsLists.find((news) => news.newsId === selectNewsId);
        setSelectNews(findNews ?? null); 
    }

    const onClickNever = useCallback(() => {
        neverMembersGet({ newsId: selectNewsId })
        onOpen();
    }, [neverMembersGet, selectNewsId])

    useEffect(() => {
        defaultPage();
        completeUp({ newsId: selectNewsId });
    }, [])

    // レンダリングされたときfindAndSetが２回呼ばれるのでイケてないコード。他に良い方法があれば書き換える
    useEffect(() => {
        findAndSet();
    }, [newsLists]);

    useEffect(() => {
        newsFileNameGet({ newsId: selectNewsId });
    }, [selectNewsId]);

    return (
        <>
            <ViewMainContainer title={selectNews?.newsTitle ?? null}>
                {
                selectNews !== null && (
                    <>
                        <Flex direction='column' w='100%' px={{base: 8, md: 16}}>
                            <Flex alignItems='center' w={{base: "360px", md: "560px"}} >
                                <ListMembersCard id={selectNews!.uesrId} isHost={false} image={selectNews.newsUserImageName} >{selectNews?.newsUserName}</ListMembersCard>
                            </Flex>
                            <Text as="h1" fontSize="xs" ml='56px' color='gray.600'>{dateKanji({date: selectNews?.postDate ?? null})}</Text>
                            <Text mt={{base: 3, md: 6}} ml='56px' whiteSpace='pre-wrap'　>
                                {selectNews?.newsContent}
                            </Text>
                            {/* ファイルの挿入 */}
                            {newsFileNames.length !== 0 && (
                                <>
                                    <AspectRatio ratio={ 1 } ml={'56px'} mt={{base: 3, md: 6}}>
                                        {
                                            newsFileNames[0].newsFileName.split('.').pop() === 'pdf' ? (
                                                <>
                                                    <Iframe url={`${process.env.PUBLIC_URL}/test/職務経歴書.pdf`} display='block' id='newsfile' allowFullScreen/>                                                
                                                </>
                                            ) : (
                                                <>
                                                    <Image src={`https://object-storage.tyo2.conoha.io/v1/nc_819897bd08504d38bcce5fc9b4d08a6f/newsfile/${newsFileNames[0].newsFileName}`} h='100%' shadow='sm'/>                                                
                                                </>
                                            )
                                        }
                                    </AspectRatio>
                                </>
                            )}
                        </Flex>
                        <Spacer />
                        {hostCheck() ? (
                        <Flex justifyContent='flex-end' w='100%' p={{base: 4, me: 8}}>
                            <Spacer />
                            <LoginButton onClick={onClickNever} >未読者一覧</LoginButton>
                            <NeverModal isOpen={isOpen} onClose={onClose} neverMembers={neverMembers} />
                        </Flex>
                        ) : null}
                    </>
                    )
                }
            </ViewMainContainer>
        </>
    )
});