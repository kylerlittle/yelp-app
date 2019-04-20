import React, { Component } from 'react';
import Choice from '../Choice';
import './FavoriteBusinessList.css';
import StarRatings from 'react-star-ratings';
import Button from 'react-bootstrap/Button';

class FavoriteBusinessList extends Component {
    constructor(props) {
        super(props);
        this.formatBusiness = this.formatBusiness.bind(this);
    }

    formatBusiness(business) {
        var cityState = `${business['business_city']}, ${business['business_state']}`;
        
        return(
            <Choice>
                <b>{business['business_name']}</b>
                <br />
                <StarRatings
                    rating={parseFloat(business['average_stars'])}
                    starDimension={'20px'}
                    starSpacing={'1px'}
                    starRatedColor={'red'}
                 />  
                <br />
                {business['business_address']}
                <br />
                {cityState}
                <br />
                <Button variant="outline-danger" 
                    onClick={(e) => 
                    this.props.handleRemoveBusiness(business['business_id'])}>
                    Remove
                </Button>
            </Choice>
        );
    }

    render() {
        const businessList = this.props.businessList.map(this.formatBusiness);
        return (
            <ul className="FavoriteBusinessList">{businessList}</ul>
        )
    }
}

export default FavoriteBusinessList;