import {trigger, state, style, animate, transition, AnimationTriggerMetadata, keyframes} from '@angular/animations';


export class ToolbarAnimator {
    constructor(){}
    static createTrigger(triggerName: string, left: string,widthShow: string,widthHide: string,height:string,showAnimateStype:string,hideAnimateStype:string): AnimationTriggerMetadata {
        return trigger(triggerName, [
            state('hide', style({ transform: 'translateX(-2%)',position:'absolute',top:'0%',bottom:'0%','margin-bottom':'50px',left:left, width: widthHide,height:height,'pointer-events': 'none' })),
            state('show', style({ transform: 'translateX(0%)' ,position:'absolute',top:'0%',bottom:'0%','margin-bottom':'50px', 'z-index': '9999'   ,left:left, width: widthShow,height:height,'pointer-events': 'inherit'})),
            transition('hide => show', [style({ }),animate(showAnimateStype)]),
            transition('show => hide', [style({}),animate(hideAnimateStype)])
        ]);
    }
    static createTriggerMember(triggerName: string, left: string,widthShow: string,widthHide: string,height:string,showAnimateStype:string,hideAnimateStype:string): AnimationTriggerMetadata {
        return trigger(triggerName, [
            state('hide', style({ transform: 'translateX(-2%)',position:'absolute',top:'0%',bottom:'0%',left:left, width: widthHide,height:height,'pointer-events': 'none' })),
            state('show', style({ transform: 'translateX(0%)' ,position:'absolute',top:'0%',bottom:'0%', 'z-index': '99'   ,left:left, width: widthShow,height:height,'pointer-events': 'inherit'})),
            transition('hide => show', [style({ }),animate(showAnimateStype)]),
            transition('show => hide', [style({}),animate(hideAnimateStype)])
        ]);
    }
}