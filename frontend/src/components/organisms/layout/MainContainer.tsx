import { memo, VFC, ReactNode } from "react"
import { Flex } from "@chakra-ui/react";


type Props = {
    children: ReactNode;
}

export const MainContainer: VFC<Props> = memo((props) => {

    const { children } = props;

    return (
        <>
            <Flex w={{base: "320px", sm: "480px", md: "720px"}} minHeight="720px" mx="auto" direction="column" bg="transparent">
                {children}
            </Flex>
        </>
    )
})

// w={{base: "480px", md:"720px"}}