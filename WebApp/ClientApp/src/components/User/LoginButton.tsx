import { ActionButton, DefaultPalette, IButtonProps, IButtonStyles } from "office-ui-fabric-react";
import React, { Component, ReactNode } from "react";
import { Success, PopupWindow } from "./PopupWindow";
import { toQuery } from "./utils";

interface Props {
    clientId: string;
    scope: string;
    redirectUri: string;
    onRequest: () => void;
    onSuccess: (success: { userName?: string; iconUrl?: string }) => void;
    onFailure: (error: Error) => void;
}

export class LoginButton extends Component<Props & IButtonProps> {
    public static defaultProps = {
        onFailure: (): void => { },
        onRequest: (): void => { },
        onSuccess: (): void => { },
        scope: "user:email",
    };

    constructor(props: Props) {
        super(props);
        this.onBtnClick = this.onBtnClick.bind(this);

        if (process.env.REACT_APP_DEMO) {
            this.onBtnClick = (): void => {
                this.props.onSuccess({ userName: "Demo User", iconUrl: process.env.PUBLIC_URL + "photo.jpg" });
            };
        }
    }

    public onBtnClick(): void {
        const { clientId, scope, redirectUri } = this.props;
        const search = toQuery({
            "client_id": clientId,
            "redirect_uri": redirectUri,
            scope,
        });
        const popup = PopupWindow.open(
            "github-oauth-authorize",
            `https://github.com/login/oauth/authorize?${search}`,
            { height: 1000, width: 600 },
        );

        this.onRequest();
        popup.then(this.onSuccess, this.onFailure);
    }

    public onRequest = (): void => {
        this.props.onRequest();
    }

    public onSuccess = (data: Success): void => {
        if (!data.code) {
            return this.onFailure(new Error("'code' not found"));
        }

        this.props.onSuccess({});
    }

    public onFailure = (error: Error): void => {
        this.props.onFailure(error);
    }

    public render(): ReactNode {
        const { className } = this.props;
        const attrs: React.ButtonHTMLAttributes<HTMLButtonElement> = { onClick: this.onBtnClick };

        if (className) {
            attrs.className = className;
        }

        const styles: IButtonStyles = {
            icon: {
                fill: DefaultPalette.white,
                height: "2em",
                marginRight: "1em",
                width: "2em",
            },
            root: {
                backgroundColor: DefaultPalette.neutralDark,
                borderWidth: 0,
                color: DefaultPalette.white,
                height: "100%",
            },
            rootHovered: {
                backgroundColor: DefaultPalette.blackTranslucent40,
                color: DefaultPalette.white,
            },
        };

        return (
            <ActionButton {...attrs} styles={styles} iconProps={{ iconName: "github-svg" }}>
                <span>Sign in with GitHub</span>
            </ActionButton>
        );
    }
}
