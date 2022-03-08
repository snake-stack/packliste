import {Container, Grid} from "@mui/material";
import * as React from "react";
import {BaseHeader, BaseLayout} from "../src/components/BaseLayout";

export default function Index() {
    return (
        <Container maxWidth="md">
            <BaseHeader />
            <BaseLayout />
            <Grid container style={{height: "75px", textAlign: "center", lineHeight: "75px"}} />
        </Container>
    );
}
