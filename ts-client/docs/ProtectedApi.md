# ProtectedApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**adminRoute**](#adminroute) | **GET** /admin | |

# **adminRoute**
> User adminRoute()


### Example

```typescript
import {
    ProtectedApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProtectedApi(configuration);

const { status, data } = await apiInstance.adminRoute();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**User**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Admin access granted |  -  |
|**403** | Forbidden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

