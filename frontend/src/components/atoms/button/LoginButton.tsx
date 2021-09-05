import { memo, ReactNode, VFC } from "react"
import { Button } from "@chakra-ui/react";

type Props = {
    children: ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onClick: () => void;
}

export const LoginButton: VFC<Props> = memo((props) => {

    const { children, disabled, loading, onClick } = props;

    return (
            <Button bg="orange.400" color="white" disabled={disabled} isLoading={loading} _hover={{ opacity: 0.5 }} onClick={onClick} >
                {children}
            </Button> 
    )
});