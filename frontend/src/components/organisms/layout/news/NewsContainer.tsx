import { VFC, memo, ReactNode } from "react"
import { Flex, Heading, Divider, Box } from "@chakra-ui/react";
import { TextButton } from "../../../atoms/button/TextButton";

type Props = {
    children: ReactNode;
    title: string;
    onClickNews: () => void;
}

export const NewsContainer: VFC<Props> = memo((props)=> {

    const { children, title, onClickNews } = props;

    return (
        <>
            <Flex w={{base: "320px", sm: "480px", md: "720px"}} maxHeight="420px" mt={{base: 6, md: 8}} px={{base: 2, md: 4}} pt={{base: 2, md: 4}} pb={{base: 3, md: 6}}  align="center" direction="column" bg="orange.50" borderRadius="xl" shadow="md" >
                <Heading mx="auto" fontSize={{base: "18", sm: "24"}} >
                    {title}
                </Heading>
                <Divider  my={{base: 2, md: 4}} borderWidth="lg" borderColor="gray.500" />
                <Flex w={{base: "280px", sm:"360px", md: "640px"}} px={2} justifyContent='flex-end'>
                <TextButton onClick={onClickNews} buttonName={'すべてを表示'} />
                </Flex>
                <Box overflow="auto" >
                    {children}
                </Box>
            </Flex>
        </>
    )
})