/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useCallback, VFC } from "react";
import { Divider, Box, useDisclosure }　from "@chakra-ui/react"

import { useLoginUser }　from "../../../hooks/context/useLoginUser";
import { SideBarTextAndButton } from "../../atoms/SideBarTextAndButton";
import { SideBarText } from "../../atoms/text/SideBarText";
import { useLoginCommunity } from "../../../hooks/context/useLoginCommunity";
import { ListCommunityCard } from "../../molecules/listCard/ListCommunityCard";
import { useCommunityMembers } from "../../../hooks/context/useCommunityMembers";
import { ListMembersCard } from "../../molecules/listCard/ListMembersCard";
import { ListUserCard } from "../../molecules/listCard/ListUserCard";
import { useHostGet } from "../../../hooks/useHostGet";
import { AllMemberModal } from "../modal/AllMemberModal";

export const SideContent: VFC = memo(() => {

    const { loginUser }　= useLoginUser();
    const { loginCommunity }　= useLoginCommunity();
    const { communityMembers } = useCommunityMembers();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { hostCheck } = useHostGet();

    const onclickAllMember = useCallback(() => {
        onOpen();
    }, [])

    return (
        <>
            <SideBarText>ログイン中</SideBarText>
            <ListUserCard isHost={hostCheck()} image={loginUser?.userImageName ?? null} >{loginUser?.userName}</ListUserCard>
            <Divider  my={4} borderWidth="lg" borderColor="gray.500" />
            {loginCommunity === null ? (
                <>
                    <SideBarText>コミュニティに参加していません</SideBarText>    
                </>
            ) : (
                <>
                <SideBarText>参加コミュニティ</SideBarText>    
                <ListCommunityCard width="280px" image={loginCommunity?.communityImageName ?? null} >{loginCommunity?.communityName} </ListCommunityCard>
                <Divider  my={4} borderWidth="lg" borderColor="gray.500" />
                <SideBarTextAndButton onClick={onclickAllMember} buttonName={"すべてを表示"} >参加メンバー</SideBarTextAndButton>
                <Box h="360px" overflow="auto" >
                    {communityMembers?.map((member) => (
                            member.userId !== loginUser?.userId ? <ListMembersCard id={member.userId} isHost={member.isHost} image={member.userImageName ?? null} key={member.userId} >{member.userName}</ListMembersCard> : null
                        ))}
                    {communityMembers.length === 1 && <SideBarText>あなた以外参加していません</SideBarText>}
                </Box>
                <AllMemberModal isOpen={isOpen} onClose={onClose} />
                </>
            )}
        </>
    )
});