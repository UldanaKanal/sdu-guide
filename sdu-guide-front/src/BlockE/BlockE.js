import React from "react";
import BlockPageTemplate from "../Components/BlockPageTemplate";
import blockImage from "../Components/assets/blockspng/BlockEimages/BlockE.png";

export default function BlockE() {
    return (
        <BlockPageTemplate
            blockLetter="E"
            blockImage={blockImage}
            leftRoute="/BlockELeftSide"
            rightRoute="/BlockERightSide"
        />
    );
}

