import { Flex, Heading } from "@chakra-ui/react"
import { memo, VFC } from "react"
import { useHistory } from "react-router-dom"
import { PageBackButton } from "../atoms/button/PageBackButton"

type Props = {
    title: string | null;
}

export const TitleAndBackButton: VFC<Props> = memo((props) => {

    const { title } = props
    const history = useHistory();
    const onClickBack = () => {
        history.go(-1);
    }
    
    return (
        <>
            <Flex w='100%' alignItems='center'>
                <PageBackButton onClickBack={onClickBack} />
                <Heading mx="auto" fontSize={{base: "18", sm: "24"}}　whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' >
                    {title}
                </Heading>
            </Flex>
        </>
    )
})