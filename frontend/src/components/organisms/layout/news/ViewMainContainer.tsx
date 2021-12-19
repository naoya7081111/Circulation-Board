import { VFC, memo, ReactNode } from "react"
import { Flex, Divider } from "@chakra-ui/react";
import { TitleAndBackButton } from "../../../molecules/TitleAndBackButton";

type Props = {
    children: ReactNode;
    title: string | null;
}

export const ViewMainContainer: VFC<Props> = memo((props)=> {

    const { children, title } = props;

    return (
        <>
            <Flex w={{base: "320px", sm: "480px", md: "720px"}} minHeight="640px" mt={{base: 6, md: 8}} p={{base: 2, md: 4}} mb={{base: 6, md: 8}} align="center" direction="column" bg="orange.50" borderRadius="xl" shadow="md" >
                <TitleAndBackButton title={title}/>
                <Divider  mt={{base: 2, md: 4}} mb={8} borderWidth="lg" borderColor="gray.500" />
                {children}
            </Flex>
        </>
    )
})

// w={{base: "480px", md: "720px"}}