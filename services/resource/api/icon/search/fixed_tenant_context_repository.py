from api.icon.search.tenant_context_repository import TenantContext, TenantContextRepository


class FixedTenantContextRepository(TenantContextRepository):
    def get(self, tenant_name: str) -> TenantContext:
        return TenantContext(
            language="english",
            domain="industrial equipments or pharmaceutical laboratory equipments",
        )
