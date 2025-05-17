import React from "react";
import FriendIntroductionCentered from "./FriendIntroductionCentered";
import LongVideoIntroduction from "./LongVideoIntroduction";
import GroupIntroduction from "./GroupIntroduction";
import InvitationIntroduction from "./InvitationIntroduction";
import { Box, AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Introductions(props) {
    const { selector, position, isMobile, onBack } = props;
    
    console.log(selector);
    
    // If no selector is provided, show a message
    if (!selector || !selector.type) {
        return (
            <Box sx={{ 
                textAlign: "center", 
                pt: 4,
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center" 
            }}>
                <Typography variant="body1" color="text.secondary">
                    Select an option to view details
                </Typography>
            </Box>
        );
    }

    // Render appropriate content based on selector type
    const renderContent = () => {
        if ("movie" === selector.type || "tv" === selector.type) {
            return <LongVideoIntroduction content={selector} position={position} isMobile={isMobile} />;
        } else if ("contact" === selector.type) {
            return <FriendIntroductionCentered userId={selector.userId} position={position} isMobile={isMobile} />;
        } else if ("groupId" === selector.type) {
            return <GroupIntroduction groupId={selector.content} isMobile={isMobile} />;
        } else if ("music" === selector.type) {
            return <Box sx={{ p: 3 }}>Haven't finished this music record function yet</Box>;
        } else if ("chatRecords" === selector.type) {
            return <Box sx={{ p: 3 }}>Haven't finished this chat record function yet</Box>;
        } else {
            return (
                <Box sx={{ 
                    textAlign: "center", 
                    pt: 4,
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center" 
                }}>
                    <Typography variant="body1" color="text.secondary">
                        Select one to view details
                    </Typography>
                </Box>
            );
        }
    };

    // For mobile views, we include our own AppBar if onBack is provided
    if (isMobile && typeof onBack === "function") {
        return (
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <AppBar >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={onBack}
                            aria-label="back"
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ ml: 1, flex: 1 }}>
                            {selector.type === "contact" ? "User Details" : 
                             selector.type === "groupId" ? "Group Details" :
                             selector.type === "movie" || selector.type === "tv" ? "Video Details" :
                             "Details"}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box sx={{ flex: 1, overflow: "auto" }}>
                    {renderContent()}
                </Box>
            </Box>
        );
    }

    // For desktop or when no back handler is provided
    return renderContent();
}