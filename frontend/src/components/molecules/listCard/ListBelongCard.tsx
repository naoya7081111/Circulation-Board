import { MouseEvent, ReactNode, VFC } from "react"
import { Flex, Image, Text, Spacer, Button } from "@chakra-ui/react";

type Props = {
    children: ReactNode;
    width: any;
    onClickButton: (e: MouseEvent<HTMLButtonElement>) => void;
    buttonName: string;
    value: number;
    image: string | null;
}

export const ListBelongCard: VFC<Props> = (props) => {
    const { children, width, onClickButton, buttonName, value, image } = props;
    return (
        <>
            <Flex w={width} h="64px" p={2} alignItems="center" borderRadius={10} bg="orange.50" > 
                <Image borderRadius="lg" boxSize="32px" src={image === null ? `${process.env.PUBLIC_URL}/img/freemeisoncommunity.png` : `https://object-storage.tyo2.conoha.io/v1/nc_819897bd08504d38bcce5fc9b4d08a6f/test/${image}`} />
                <Text fontSize="sm" fontWeight="bold" pl={4} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' >
                    {children}
                </Text>
                <Spacer />
                <Button fontSize="xs" shadow="sm" onClick={onClickButton} value={value}>{buttonName}</Button>
            </Flex>
        </>
    )
}