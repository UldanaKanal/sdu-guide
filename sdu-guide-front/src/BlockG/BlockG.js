import React from "react";
import BlockPageTemplate from "../Components/BlockPageTemplate";
import blockImage from "../Components/assets/blockspng/BlockGimages/BlockG.png";

export default function BlockG() {
    return (
        <BlockPageTemplate
            blockLetter="G"
            blockImage={blockImage}
            leftRoute="/BlockGLeftSide"
            rightRoute="/BlockGRightSide"
        />
    );
}

