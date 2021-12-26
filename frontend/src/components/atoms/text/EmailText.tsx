import { memo, VFC, ReactNode } from "react"
import { Text, HStack } from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";

type Props = {
    children: ReactNode;
    color: string;
    boxSize: string;
    fontSize: string;
}

export const EmailText: VFC<Props> = memo((props) => {

    const { children, color, boxSize, fontSize } = props;

    return (
        <>
            <HStack>
                <EmailIcon color={color} boxSize={boxSize} />
                <Text fontSize={fontSize} color={color}>
                    {children}
                </Text>
            </HStack>
        </>
    )
})