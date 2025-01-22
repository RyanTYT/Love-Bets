def get_cum_data_for_bet(bet_data, user_id_1, user_id_2):
    # Process and format the data
    cur_cum_for, cur_cum_against = 0, 0
    dates, cumulative_for, cumulative_against = [bet_data[0].bet_time.date()], [], []
    for bet in bet_data:
        (
            composite_primary_key_for_some_reason, better, user_id_1, user_id_2, bet_amount, bet_direction,
            bet_time, bet_end_time, bet_description,
            user1_name, user1_profile_pic, user2_name, user2_profile_pic,
            popular
        ) = bet

        current_date = dates[-1]
        bet_date = bet_time.date()  # Extract the date

        if current_date != bet_date:  # Check if the date has changed
            dates.append(bet_date)
            cumulative_for.append(cur_cum_for)
            cumulative_against.append(cur_cum_against)

        # Update cumulative amounts
        if bet_direction == 1:
            cur_cum_for += bet_amount
        else:
            cur_cum_against += bet_amount
    cumulative_for.append(cur_cum_for)
    cumulative_against.append(cur_cum_against)

     # Calculate live odds
    total_bets = sum(bet.bet_amount for bet in bet_data)
    long_bets = sum(bet.bet_amount for bet in bet_data if bet.bet_direction == 1)
    short_bets = sum(bet.bet_amount for bet in bet_data if bet.bet_direction == 0)

    return {
        'user_id_1': {
            'name': bet_data[0].user1_name,
            'email': user_id_1,
            'profile_pic': bet_data[0].user1_profile_pic
        },
        'user_id_2': {
            'name': bet_data[0].user2_name,
            'email': user_id_2,
            'profile_pic': bet_data[0].user2_profile_pic
        },
        'bet_description': bet_data[0].bet_description,
        'dates': dates,
        'cumulative_for': cumulative_for,
        'cumulative_against': cumulative_against,

        'live_odds': {
            'long': (long_bets / total_bets) if total_bets else 0,
            'short': (short_bets / total_bets) if total_bets else 0
        },
        'popular': bet_data[0].popular
    }

