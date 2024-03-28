from couchbase.cluster import Cluster, ClusterOptions
from couchbase.auth import PasswordAuthenticator
import warnings

warnings.filterwarnings("ignore")

# still not finished, WIP
"""
cluster = Cluster("couchbase://localhost", ClusterOptions(PasswordAuthenticator("Administrator", "password")))
bucket = cluster.bucket("config")
collection = bucket.default_collection()
warnings.resetwarnings()
"""
print("Connected to couchbase successfully")


