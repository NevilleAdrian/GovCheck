import React from 'react'

const styles = {
    position: 'fixed',
    width: "100%",
    zIndex: "999999",
    height: "100vh"
}
export class Spinner extends React.Component {
    render() {
        return (
            <div class="ui segment" style={styles}>
                <div class="ui active transition visible dimmer">
                    <div class="content"><div class="ui loader"></div></div>
                </div>
                <img src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" alt='spinner' class="ui image" />
            </div>
            )
    }
}

export default Spinner