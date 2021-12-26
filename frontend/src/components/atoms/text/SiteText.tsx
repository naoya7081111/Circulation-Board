import { memo, VFC, ReactNode } from "react"
import { Text, HStack, Link } from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";

type Props = {
    children: ReactNode;
    color: string;
    boxSize: string;
    fontSize: string;
}

export const SiteText: VFC<Props> = memo((props) => {

    const { children, color, boxSize, fontSize } = props;

    return (
        <>
            <Link href={String(children)}>
                <HStack>
                    <LinkIcon color={color} boxSize={boxSize} />
                    <Text fontSize={fontSize} color={color}>
                        {children}
                    </Text>               
                </HStack>
            </Link>
        </>
    )
})