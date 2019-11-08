import React from 'react';
import './Footer.css'

export class Footer extends React.Component {
    render() {
        return (
            <div>
                <div className="footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-md-8">
                                <div className="footer_left">
                                    <div className="footer_brandname">
                                        <img className="footer_logo" src="images/footer_logo.png" alt="footer_logo" /> Gov<span className="footer_logo_span">CHECK</span>
                                    </div>
                                   
                                    </div>
                                </div>
                                <div className="col-12 col-md-4">
                                    <div className="row footer_links">
                                        <div className="hidden-links col-md-6 col-12 fl_ml">
                                            <a href="">Home</a>
                                            <a href="">Discovery</a>
                                            <a href="">Photos</a>
                                            <a href="">Contact</a>
                                        </div>
                                        <div className="mobile_links col-md-6 col-12">
                                            <a href="">About</a>
                                            <a href="">Projects</a>
                                            <a href="">Help</a>
                                            <a href="">Privacy</a>
                                            <a href="">Contact</a>
                                            <a href="">Login</a>
                                        </div>
                                </div>
                              
                                    
                                </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-8">
                                <div className="email">
                                    <form action="#" >
                                        <input type="email" placeholder="Email" />
                                        <button className="submit desktop_button" name="submit"><span className="rotate">&#10148;</span></button>
                                        <p>Stay in touch with us for updates on GovCHECK</p>
                                    </form>
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="footer_social_links">
                                    <a href="#" className="fa fa-instagram"></a>
                                    <a href="#" className="fa fa-twitter"></a>
                                    <a href="#" className="fa fa-facebook"></a>
                                    <a href="#" className="fa fa-globe"></a>
                                </div>
                            </div>
                        </div>
                        </div>

                    </div>

                </div>
            )
    }
}