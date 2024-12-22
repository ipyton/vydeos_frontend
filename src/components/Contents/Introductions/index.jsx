import FriendIntroductionCentered from "./FriendIntroductionCentered"
import LongVideoIntroduction from "./LongVideoIntroduction"
import GroupIntroduction from "./GroupIntroduction"
import InvitationIntroduction from "./InvitationIntroduction"

export default function (props) {
    const { selector } = props
    console.log(selector)
    if (!selector.type) {
        return (<div>select an option to view</div>)
    }
    if ("movie" === selector.type) {
        return (<LongVideoIntroduction videoId={selector.videoId} position={"right"}></LongVideoIntroduction>)
    } else if ("contact" === selector.type) {
        return <FriendIntroductionCentered userId={selector.userId} position={"right"}></FriendIntroductionCentered>
    } else if ("group" === selector.type) {
        return <div>haven't finished this group record function yet</div>
    } else if ("music" === selector.type) {
        return <div>haven't finished this music record function yet</div>
    } else if ("chatRecords" === selector.type) {
        return <div>haven't finished this chat record function yet</div>
    }
    else {
        return ("Select one to view details")
    }
}