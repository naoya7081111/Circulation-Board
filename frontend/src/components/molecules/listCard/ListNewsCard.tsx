import { VFC, memo, ReactNode, MouseEvent } from "react"
import { Flex, Badge, Text, Spacer, Button } from "@chakra-ui/react";

type Props = {
    children: ReactNode;
    value: number;
    isComplete: boolean;
    onClickNews: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const ListNewsCard: VFC<Props> = memo((props)=> {

    const { children, value, isComplete, onClickNews } = props;
    
    return (
        <>
            <Flex w={{base: "280px", sm:"360px", md: "640px"}} h={{base: "56px", sm:"64px", md: "72px"}} p={2} alignItems="center" borderRadius={10} bg="orange.50" _hover={{ cursor: "pointer", bg: "orange.100"}} > 
                <Badge colorScheme={isComplete ? 'teal' : 'red'}>
                    {isComplete ? '既読' : '未読'}
                </Badge>
                <Text w={{base: "180px", md: "320px"}} h="24px" fontSize={{base: "sm", sm: "md"}} fontWeight="bold" pl={4} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
                    {children}
                </Text>
                <Spacer />
                <Button fontSize="xs" shadow="sm" onClick={onClickNews} value={value}>チェック</Button>
            </Flex>
        </>
    )
})