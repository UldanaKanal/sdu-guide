import React from "react";
import BlockPageTemplate from "../Components/BlockPageTemplate";
import blockImage from "../Components/assets/blockspng/BlockDimages/BlockD.png";

export default function BlockD() {
    return (
        <BlockPageTemplate
            blockLetter="D"
            blockImage={blockImage}
            leftRoute="/BlockDLeftSide"
            rightRoute="/BlockDRightSide"
        />
    );
}

