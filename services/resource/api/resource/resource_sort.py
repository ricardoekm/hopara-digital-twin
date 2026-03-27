def resource_sort(resources: list, query: str) -> None:
    resources.sort(key=lambda x: x["name"])
    if query:
        resources.sort(key=lambda x: x["name"].startswith(query), reverse=True)
