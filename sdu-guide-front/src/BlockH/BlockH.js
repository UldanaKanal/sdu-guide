import React from "react";
import BlockPageTemplate from "../Components/BlockPageTemplate";
import blockImage from "../Components/assets/blockspng/BlockHimages/BlockH.png";

export default function BlockH() {
    return (
        <BlockPageTemplate
            blockLetter="H"
            blockImage={blockImage}
            leftRoute="/BlockHLeftSide"
            rightRoute="/BlockHRightSide"
        />
    );
}

