import {
    ConstrainMode,
    DefaultPalette, DetailsList,
    DetailsListLayoutMode,
    getInitials,
    IColumn,
    Persona,
    PersonaInitialsColor,
    PersonaSize,
    ScrollablePane,
    ScrollbarVisibility,
    SelectionMode,
    Stack,
    StackItem,
} from "office-ui-fabric-react";
import React, { Component } from "react";
import { Resource } from "../../services/fileService";

interface Props {
    resources: Resource[];
    onActiveItemChanged?: (item?: any, index?: number, ev?: React.FocusEvent<HTMLElement>) => void;
}

interface State {
    selectedResource: Resource;
}

export class ResourceList extends Component<Props, State> {

    private columns: IColumn[] = [{
        key: "name",
        name: "Name",
        fieldName: "key",
        minWidth: 50,
        maxWidth: 300,
        isResizable: true,
        onRender: this.onRenderResource.bind(this),
    }, {
        key: "editor",
        name: "Modified By",
        fieldName: "editor",
        minWidth: 100,
        maxWidth: 150,
    }];

    public constructor(props: Props) {
        super(props);
        this.onRenderResource = this.onRenderResource.bind(this);

        this.state = {
            selectedResource: this.props.resources[0],
        };
    }

    public render(): JSX.Element {

        return (
            <Stack grow={1} horizontal={true} styles={{ root: { height: "calc( 100vh - 7rem - 32px )" } }}>
                <StackItem grow={1} styles={{ root: { position: "relative" } }}>
                    <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
                        <DetailsList
                            constrainMode={ConstrainMode.horizontalConstrained}
                            layoutMode={DetailsListLayoutMode.justified}
                            selectionMode={SelectionMode.none}
                            selectionPreservedOnEmptyClick={true}
                            items={this.props.resources}
                            columns={this.columns}
                            onActiveItemChanged={this.onSelectionChange}
                        />
                    </ScrollablePane>
                </StackItem>
            </Stack>
        );
    }

    private onRenderResource(resource: Resource, index?: number, column?: IColumn): JSX.Element {
        return (
            <Persona
                imageInitials={getInitials(resource.editor, false)}
                initialsColor={PersonaInitialsColor.violet}
                coinProps={{ styles: { initials: { color: DefaultPalette.white } } }}
                size={PersonaSize.size40}
                text={resource.key}
                secondaryText={this.props.resources[index!].translation || resource.source}
            />);
    }

    private onSelectionChange = (resource?: Resource): void => {
        this.setState({
            selectedResource: resource!,
        });
        if (this.props.onActiveItemChanged) {
            this.props.onActiveItemChanged(resource);
        }
    }
}
