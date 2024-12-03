# import requests 
# import json
# import psycopg2
# from datetime import datetime
# import logging

# # Replace with your own Ticketmaster API key
# API_KEY = '6bZRj7CXIAgqtkpTvIR8xOYRKWLALczM'
# VENUE_ID = 'KovZpZA7AAEA'  # Use the appropriate venue ID
# URL = f'https://app.ticketmaster.com/discovery/v2/events.json?venueId={VENUE_ID}&apikey={API_KEY}'

# # Database connection details
# DB_HOST = 'localhost'
# DB_NAME = 'arena'
# DB_USER = 'postgres'
# DB_PASS = 'Manaswi@17'

# # Set up logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# def get_events():
#     try:
#         response = requests.get(URL)
#         response.raise_for_status()  # Raise an error for bad responses
#         data = response.json()

#         # Check if any events were found
#         if '_embedded' in data and 'events' in data['_embedded']:
#             events = data['_embedded']['events']
#             save_events_to_db(events)
#         else:
#             logger.info("No events found for this venue.")

#     except requests.exceptions.RequestException as e:
#         logger.error(f"Error fetching events: {e}")
# def save_events_to_db(events):
#     conn = None
#     cursor = None

#     try:
#         conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
#         cursor = conn.cursor()

#         for event in events:
#             name = event['name']
#             date_str = event['dates']['start']['localDate']
#             local_time = event['dates']['start'].get('localTime', '00:00:00')  # Get local time or default to '00:00:00'
#             date = datetime.strptime(date_str + ' ' + local_time, '%Y-%m-%d %H:%M:%S')

#             # Insert event into the database
#             cursor.execute("""
#                 INSERT INTO events (name, date)
#                 VALUES (%s, %s)
#                 """, (name, date))

#             logger.info(f"Inserted event: {name} on {date}")

#         conn.commit()

#     except (Exception, psycopg2.DatabaseError) as error:
#         logger.error(f"Error inserting events: {error}")
    
#     finally:
#         if cursor:
#             cursor.close()
#         if conn:
#             conn.close()


# if __name__ == "__main__":  # Corrected entry point
#     get_events()
# events_fetch.py

import requests 
import json
import psycopg2
from datetime import datetime
import logging

# Replace with your own Ticketmaster API key
API_KEY = '6bZRj7CXIAgqtkpTvIR8xOYRKWLALczM'
VENUE_ID = 'KovZpZA7AAEA'  # Use the appropriate venue ID
URL = f'https://app.ticketmaster.com/discovery/v2/events.json?venueId={VENUE_ID}&apikey={API_KEY}'

# Database connection details
DB_HOST = 'localhost'
DB_NAME = 'postgres'
DB_USER = 'postgres'
DB_PASS = 'pass@123'

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_events():
    try:
        response = requests.get(URL)
        response.raise_for_status()  # Raise an error for bad responses
        data = response.json()

        # Check if any events were found
        if '_embedded' in data and 'events' in data['_embedded']:
            events = data['_embedded']['events']
            save_events_to_db(events)
        else:
            logger.info("No events found for this venue.")

    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching events: {e}")
def save_events_to_db(events):
    conn = None
    cursor = None

    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
        cursor = conn.cursor()

        for event in events:
            name = event['name']
            date_str = event['dates']['start']['localDate']
            local_time = event['dates']['start'].get('localTime', '00:00:00')  # Get local time or default to '00:00:00'
            date = datetime.strptime(date_str + ' ' + local_time, '%Y-%m-%d %H:%M:%S')

            # Insert event into the database
            cursor.execute("""
                INSERT INTO events (name, date)
                VALUES (%s, %s)
                """, (name, date))

            logger.info(f"Inserted event: {name} on {date}")

        conn.commit()

    except (Exception) as error:
        logger.error(f"Error inserting events: {error}")
    
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


if __name__ == "__main__":  # Corrected entry point
    get_events()