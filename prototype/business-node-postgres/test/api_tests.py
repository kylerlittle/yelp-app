import unittest, pycurl
try:
    from io import BytesIO
except ImportError:
    from StringIO import StringIO as BytesIO
import json

# Root URL of backend
base_url = "localhost:3000/"

# Used link: http://pycurl.io/docs/latest/quickstart.html
# for "header_funtion" and "encoding" portion
headers = {}
def header_function(header_line):
    # HTTP standard specifies that headers are encoded in iso-8859-1.
    # On Python 2, decoding step can be skipped.
    # On Python 3, decoding step is required.
    header_line = header_line.decode('iso-8859-1')

    # Header lines include the first status line (HTTP/1.x ...).
    # We are going to ignore all lines that don't have a colon in them.
    # This will botch headers that are split on multiple lines...
    if ':' not in header_line:
        return

    # Break the header line into header name and value.
    name, value = header_line.split(':', 1)

    # Remove whitespace that may be present.
    # Header lines include the trailing newline, and there may be whitespace
    # around the colon.
    name = name.strip()
    value = value.strip()

    # Header names are case insensitive.
    # Lowercase name here.
    name = name.lower()

    # Now we can actually record the header name and value.
    # Note: this only works when headers are not duplicated, see below.
    headers[name] = value

# Figure out what encoding was sent with the response, if any.
# Check against lowercased header name.
encoding = None
if 'content-type' in headers:
    content_type = headers['content-type'].lower()
    match = re.search('charset=(\S+)', content_type)
    if match:
        encoding = match.group(1)
        print('Decoding using %s' % encoding)
if encoding is None:
    # Default encoding for HTML is iso-8859-1.
    # Other content types may have different default encoding,
    # or in case of binary data, may have no encoding at all.
    encoding = 'iso-8859-1'
    print('Assuming encoding is %s' % encoding)

class TestBusinessAPI(unittest.TestCase):
    def setUp(self):
        self.curl = pycurl.Curl()
        self.buffer = BytesIO()
        self.curl.setopt(self.curl.WRITEFUNCTION, self.buffer.write)
        # Set our header function.
        self.curl.setopt(self.curl.HEADERFUNCTION, header_function)

    def test_root(self):
        """Test root URL -- should return list of states.
        """
        states = self.make_request('business_state')
        self.assertEqual(states, ["AZ", "IL", "NC", "NV", "PA", "SC", "WI"])

    def test_get_cities(self):
        """Test '/:state' URL -- should return list of cities in state.
        """
        cities = self.make_request('business_city', 'IL')
        self.assertEqual(cities, ["Champaign", "Savoy", "Urbana"])

    def test_get_businesses(self):
        """Test '/:state/:city' URL -- should return list of businesses in city AND state.
        """
        businesses = self.make_request('business_name', 'NC/Belmont')

        # Giant list, so will just test first and last items.
        self.assertIn("Alternative Beverage", businesses)
        self.assertIn("William Henry Signature Salon", businesses)

    def make_request(self, column_header, add_to_url=""):
        """Make the GET request with base_url concatenated with add_to_url.

        Return list of actual attributes from list of JSON objects with key column_header.
        """
        self.curl.setopt(self.curl.URL, base_url + add_to_url)
        self.curl.perform()
        resp = self.buffer.getvalue().decode(encoding)
        obj = json.loads(resp)
        return [d[column_header] for d in obj]

    def tearDown(self):
        self.curl.close()

if __name__ == '__main__':
    unittest.main()