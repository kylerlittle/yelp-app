import React, { Component } from 'react';
import Choice from './Choice';
import StarRatings from 'react-star-ratings';
import './SelectedBusinessReviews.css'

class SelectedBusinessReviews extends Component {
  formatReview(review) {
    var date_written = new Date(review['date_written'].replace(' ', 'T'));
    return(
        <Choice>
            {review['user_name']}
            <br />
            <StarRatings
                rating={parseFloat(review['stars_given'])}
                starDimension={'25px'}
                starSpacing={'1px'}
                starRatedColor={'red'}
            />
            <br />
            {review['business_name']}
            <br />
            {`${date_written.getMonth() + 1}/${date_written.getDate()}/${date_written.getFullYear()}`}
            <br />
            {review['review_text']}
        </Choice>
    );
  }
  render() {
    const formattedList = this.props.reviewList.map(this.formatReview);
    return (
        <ul className="SelectedBusinessReviews">{formattedList}</ul>
    );
  }
}

export default SelectedBusinessReviews;