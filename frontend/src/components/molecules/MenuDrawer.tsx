import { memo, VFC } from "react"
import { Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";

import { SideContent } from "../organisms/contentOrder/SideContent";

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

export const MenuDrawer: VFC<Props> = memo((props) => {

    const { isOpen, onClose } = props;

    return (
        <Drawer placement="left" size="xs" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay >
                <DrawerContent>
                    <DrawerBody bg="orange.50">
                        <SideContent />
                    </DrawerBody>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    )
})