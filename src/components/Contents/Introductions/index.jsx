import FriendIntroductionCentered from "./FriendIntroductionCentered"
import LongVideoIntroduction from "./LongVideoIntroduction"
import GroupIntroduction from "./GroupIntroduction"
import InvitationIntroduction from "./InvitationIntroduction"

export default function (props) {
    const { selector , position} = props
    console.log(selector)
    if ("longvideo" === selector.type) {
        return (<LongVideoIntroduction videoId={selector.content} position={position}></LongVideoIntroduction>)
    } else if ("userId" === selector.type) {
        return <FriendIntroductionCentered userId={selector.content} position={position}></FriendIntroductionCentered>
    } else if ("groupId" === selector.type) {
        return <GroupIntroduction groupId={selector.content} position={position}></GroupIntroduction>
    } else if ("invitaionId" === selector.type) {
        return (<InvitationIntroduction invitationId={selector.content} position={position}></InvitationIntroduction>)
    } 

}