/* eslint-disable react-hooks/exhaustive-deps */
import { memo, ReactNode, useCallback, useState, VFC } from "react"
import { Flex, Image, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import { MemberInfoModal } from "../../organisms/modal/MemberInfoModal";

type Props = {
    children: ReactNode;
    id: number;
    isHost: boolean;
    image: string | null;
};

export const ListMembersCard: VFC<Props> = memo((props) => {

    const { children, id, isHost, image } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [selcetMemberId, setSelectMemberId] = useState<number | null>(null);

    const onClickMemberModal = useCallback((id: number | null) => {
        setSelectMemberId(id);
        onOpen();
    }, [id]);

    return (
        <>
            <Flex w="280px" mb={4} alignItems="center" borderRadius={10} bg="orange.50" _hover={{ cursor: "pointer", bg: "orange.100"}} onClick={() => onClickMemberModal(id)} > 
                <Image borderRadius="full" color={isHost ? 'pink.400' : 'gray.600'} border='2px' boxSize="42px" src={image === null ? `${process.env.PUBLIC_URL}/img/freemeison.jpeg` : `https://object-storage.tyo2.conoha.io/v1/nc_819897bd08504d38bcce5fc9b4d08a6f/test/${image}`} />
                <Text fontSize="sm" fontWeight="bold" pl={4} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' >
                    {children}
                </Text>
                <Spacer />
                {isHost ? (
                    <>
                        <Text fontSize="xs" color="pink.400">HOST</Text>
                    </>
                ) : null }
            </Flex>
            <MemberInfoModal isOpen={isOpen} onClose={onClose} id={selcetMemberId} />
        </>
    );
});