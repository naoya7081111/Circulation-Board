import { memo, VFC, ReactNode } from "react"
import { Text, HStack } from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";

type Props = {
    children: ReactNode;
    color: string;
    boxSize: string;
    fontSize: string;
}

export const DateText: VFC<Props> = memo((props) => {

    const { children, color, boxSize, fontSize } = props;

    return (
        <>
            <HStack>
                <CalendarIcon color={color} boxSize={boxSize} />
                <Text fontSize={fontSize} color={color}>
                    {children}
                </Text>
            </HStack>
        </>
    )
})