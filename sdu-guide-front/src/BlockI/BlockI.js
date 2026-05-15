import React from "react";
import BlockPageTemplate from "../Components/BlockPageTemplate";
import blockImage from "../Components/assets/blockspng/BlockIimages/BlockI.png";

export default function BlockI() {
    return (
        <BlockPageTemplate
            blockLetter="I"
            blockImage={blockImage}
            leftRoute="/BlockILeftSide"
            rightRoute="/BlockIRightSide"
        />
    );
}

