import React from "react";
import BlockPageTemplate from "../Components/BlockPageTemplate";
import blockImage from "../Components/assets/blockspng/BlockFimages/BlockF.png";

export default function BlockF() {
    return (
        <BlockPageTemplate
            blockLetter="F"
            blockImage={blockImage}
            leftRoute="/BlockFLeftSide"
            rightRoute="/BlockFRightSide"
        />
    );
}

