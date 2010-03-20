/**
 * The contents of this file are subject to the OpenMRS Public License
 * Version 1.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 *
 * Copyright (C) OpenMRS, LLC.  All Rights Reserved.
 */
package org.openmrs.module.idgen.service.db;

import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Expression;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.openmrs.PatientIdentifierType;
import org.openmrs.User;
import org.openmrs.api.APIException;
import org.openmrs.api.db.DAOException;
import org.openmrs.module.idgen.AutoGenerationOption;
import org.openmrs.module.idgen.IdentifierPool;
import org.openmrs.module.idgen.IdentifierSource;
import org.openmrs.module.idgen.LogEntry;
import org.openmrs.module.idgen.PooledIdentifier;
import org.openmrs.module.idgen.service.IdentifierSourceService;
import org.springframework.transaction.annotation.Transactional;

/**
 *  Hibernate Implementation of the IdentifierSourceDAO Interface
 */
@Transactional
public class HibernateIdentifierSourceDAO implements IdentifierSourceDAO {
	
	protected Log log = LogFactory.getLog(getClass());
	
	//***** PROPERTIES *****
	
	private SessionFactory sessionFactory;
	
	//***** INSTANCE METHODS *****

	/** 
	 * @see IdentifierSourceService#getIdentifierSource(Integer)
	 */
	@Transactional(readOnly=true)
	public IdentifierSource getIdentifierSource(Integer id) throws APIException {
		return (IdentifierSource) sessionFactory.getCurrentSession().get(IdentifierSource.class, id);
	}

	/** 
	 * @see IdentifierSourceDAO#getAllIdentifierSources(boolean)
	 */
	@SuppressWarnings("unchecked")
	@Transactional(readOnly=true)
	public List<IdentifierSource> getAllIdentifierSources(boolean includeRetired) throws DAOException {
		Criteria criteria = sessionFactory.getCurrentSession().createCriteria(IdentifierSource.class);
		if (!includeRetired) {
			criteria.add(Expression.like("retired", false));
		}
		criteria.addOrder(Order.asc("name"));
		return criteria.list();
	}

	/**
	 * @see IdentifierSourceService#saveIdentifierSource(IdentifierSource)
	 */
	@Transactional
	public IdentifierSource saveIdentifierSource(IdentifierSource identifierSource) throws APIException {		
		sessionFactory.getCurrentSession().saveOrUpdate(identifierSource);
		return identifierSource;
	}

	/** 
	 * @see IdentifierSourceService#purgeIdentifierSource(IdentifierSource)
	 */
	@Transactional
	public void purgeIdentifierSource(IdentifierSource identifierSource) {
		sessionFactory.getCurrentSession().delete(identifierSource);
	}
	
	/**
	 * 
	 * @see IdentifierSourceDAO#getAvailableIdentifiers(IdentifierPool, boolean, boolean)
	 */
	@Transactional(readOnly=true)
	@SuppressWarnings("unchecked")
	public List<PooledIdentifier> getAvailableIdentifiers(IdentifierPool pool, int quantity) {
		Criteria criteria = sessionFactory.getCurrentSession().createCriteria(PooledIdentifier.class);
		criteria.add(Expression.isNull("dateUsed"));
		criteria.add(Expression.eq("pool", pool));
		criteria.setMaxResults(quantity);
		if (pool.isSequential()) {
			criteria.addOrder(Order.asc("identifier"));
		}
		else {
			criteria.addOrder(Order.asc("uuid"));
		}
		List<PooledIdentifier> results = (List<PooledIdentifier>) criteria.list();
		if (results.size() < quantity) {
			throw new RuntimeException("Unable to retrieve " + quantity + " available identifiers from Pool " + pool + ".  Maybe you need to add more identifiers to your pool first.");
		}
		return results;
	}
	
	/**
     * 
     * @see IdentifierSourceDAO#getPooledIdentifierByIdentifier(IdentifierPool, String)
     */
    @SuppressWarnings("unchecked")
    @Transactional(readOnly=true)
    public PooledIdentifier getPooledIdentifierByIdentifier(IdentifierPool pool, String identifier) {
        Criteria criteria = sessionFactory.getCurrentSession().createCriteria(PooledIdentifier.class);
        criteria.add(Expression.eq("pool", pool));
        criteria.add(Expression.eq("identifier", identifier));
        return (PooledIdentifier) criteria.uniqueResult();
    }
	
	/**
	 * @see IdentifierSourceDAO#getQuantityInPool(IdentifierPool, boolean, boolean)
	 */
	@Transactional(readOnly=true)
	public int getQuantityInPool(IdentifierPool pool, boolean availableOnly, boolean usedOnly) {
		String hql = "select count(*) from PooledIdentifier where pool_id = " + pool.getId();
		if (availableOnly) {
			hql += " and date_used is null";
		}
		if (usedOnly) {
			hql += " and date_used is not null";
		}
		Query query = sessionFactory.getCurrentSession().createQuery(hql);
		return Integer.parseInt(query.uniqueResult().toString());
	}
	
	/** 
	 * @see IdentifierSourceDAO#getAutoGenerationOption(PatientIdentifierType)
	 */
	@Transactional(readOnly=true)
	public AutoGenerationOption getAutoGenerationOption(PatientIdentifierType type) throws APIException {
		Criteria criteria = sessionFactory.getCurrentSession().createCriteria(AutoGenerationOption.class);
		criteria.add(Expression.eq("identifierType", type));
		return (AutoGenerationOption)criteria.uniqueResult();
	}

	/** 
	 * @see IdentifierSourceDAO#saveAutoGenerationOption(AutoGenerationOption)
	 */
	@Transactional
	public AutoGenerationOption saveAutoGenerationOption(AutoGenerationOption option) throws APIException {
		sessionFactory.getCurrentSession().saveOrUpdate(option);
		return option;
	}

	/** 
	 * @see IdentifierSourceDAO#purgeAutoGenerationOption(AutoGenerationOption)
	 */
	@Transactional
	public void purgeAutoGenerationOption(AutoGenerationOption option) throws APIException {
		sessionFactory.getCurrentSession().delete(option);
	}

	/** 
	 * @see IdentifierSourceDAO#getLogEntries(IdentifierSource, Date, Date, String, User)
	 */
	@SuppressWarnings("unchecked")
	public List<LogEntry> getLogEntries(IdentifierSource source, Date fromDate, Date toDate, 
										String identifier, User generatedBy, String comment) throws DAOException {
		Criteria criteria = sessionFactory.getCurrentSession().createCriteria(LogEntry.class);
		if (source != null) {
			criteria.add(Expression.eq("source", source));
		}
		if (fromDate != null) {
			Calendar c = Calendar.getInstance();
			c.setTime(fromDate);
			c.set(Calendar.HOUR_OF_DAY, 0);
			c.set(Calendar.MINUTE, 0);
			c.set(Calendar.SECOND, 0);
			c.set(Calendar.MILLISECOND, 0);
			criteria.add(Expression.ge("dateGenerated", fromDate));
		}
		if (toDate != null) {
			Calendar c = Calendar.getInstance();
			c.setTime(toDate);
			c.add(Calendar.DATE, 1);
			c.set(Calendar.HOUR_OF_DAY, 0);
			c.set(Calendar.MINUTE, 0);
			c.set(Calendar.SECOND, 0);
			c.set(Calendar.MILLISECOND, 0);
			criteria.add(Expression.lt("dateGenerated", c.getTime()));
		}
		if (identifier != null) {
			criteria.add(Expression.like("identifier", identifier, MatchMode.ANYWHERE));
		}	
		if (generatedBy != null) {
			criteria.add(Expression.eq("generatedBy", generatedBy));
		}
		if (comment != null) {
			criteria.add(Expression.like("comment", comment, MatchMode.ANYWHERE));
		}	
		criteria.addOrder(Order.desc("dateGenerated"));
		return (List<LogEntry>) criteria.list();
	}
	
	
	
	/** 
     * @see IdentifierSourceDAO#getLogEntryByIdentifierAndSource(IdentifierSource, String)
     */
    @SuppressWarnings("unchecked")
    @Transactional(readOnly=true)
    public LogEntry getLogEntryByIdentifierAndSource(IdentifierSource source, String identifier) throws DAOException {
        Criteria criteria = sessionFactory.getCurrentSession().createCriteria(LogEntry.class);
        if (source != null) {
            criteria.add(Expression.eq("source", source));
        }
        if (identifier != null) {
            criteria.add(Expression.like("identifier", identifier));
        }   
        return (LogEntry) criteria.uniqueResult();
    }
    

	/** 
	 * @see org.openmrs.module.idgen.service.db.IdentifierSourceDAO#saveLogEntry(LogEntry)
	 */
	public LogEntry saveLogEntry(LogEntry logEntry) throws DAOException {
		sessionFactory.getCurrentSession().saveOrUpdate(logEntry);
		return logEntry;
	}	
	
	//***** PROPERTY ACCESS *****

	/**
	 * @return the sessionFactory
	 */
	public SessionFactory getSessionFactory() {
		return sessionFactory;
	}

	/**
	 * @param sessionFactory the sessionFactory to set
	 */
	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}
	
	public Set<String> getPatientIdentifiersByIdentifierType(PatientIdentifierType pit){
	    SQLQuery hql = sessionFactory.getCurrentSession().createSQLQuery("select identifier from patient_identifier where identifier_type = " + pit.getPatientIdentifierTypeId());
	    Set<String> st = new HashSet<String>();
	    for (Object o : hql.list()){
	        st.add((String) o);
	    }
	    return st;
	}
}