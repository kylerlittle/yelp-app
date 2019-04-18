import React, { Component } from 'react';
import Choice from './Choice';
import StarRatings from 'react-star-ratings';
import './FavoriteBusinessList.css';

class FavoriteBusinessList extends Component {
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