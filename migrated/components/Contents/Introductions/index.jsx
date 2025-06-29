import React from "react";
import dynamic from "next/dynamic";
import { Box, Typography } from "@mui/material";
import styles from "../../../styles/Introductions.module.css";

// Dynamic imports for components
const FriendIntroductionCentered = dynamic(() => import("./FriendIntroductionCentered"));
const LongVideoIntroduction = dynamic(() => import("./LongVideoIntroduction"), { ssr: false });
const GroupIntroduction = dynamic(() => import("./GroupIntroduction"), { ssr: false });

export default function Introductions(props) {
    const { selector, position, isMobile, onBack } = props;
    
    // If no selector is provided, show a message
    if (!selector || !selector.type) {
        return (
            <Box className={styles.container}>
                <Typography variant="body1" color="text.secondary">
                    Select an option to view details
                </Typography>
            </Box>
        );
    }

    // Render appropriate content based on selector type
    const renderContent = () => {
        if ("movie" === selector.type || "tv" === selector.type) {
            return <LongVideoIntroduction content={selector} position={position} isMobile={isMobile} onBack={onBack}/>;
        } else if ("contact" === selector.type) {
            return <FriendIntroductionCentered userId={selector.userId} position={position} isMobile={isMobile} onBack={onBack}/>;
        } else if ("groupId" === selector.type) {
            return <GroupIntroduction groupId={selector.content} isMobile={isMobile} onBack={onBack} />;
        } else if ("music" === selector.type) {
            return <Box sx={{ p: 3 }}>Haven't finished this music record function yet</Box>;
        } else if ("chatRecords" === selector.type) {
            return <Box sx={{ p: 3 }}>Haven't finished this chat record function yet</Box>;
        } else {
            return (
                <Box className={styles.container}>
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
            <Box>
                {renderContent()}
            </Box>
        );
    }

    // For desktop or when no back handler is provided
    return renderContent();
} 