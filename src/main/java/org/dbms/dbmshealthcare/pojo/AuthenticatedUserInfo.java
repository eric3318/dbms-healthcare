package org.dbms.dbmshealthcare.pojo;

import org.dbms.dbmshealthcare.constants.Role;

public record AuthenticatedUserInfo(String id, Role role, String roleId) {

}
